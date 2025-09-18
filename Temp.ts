Nice — I’ll be your step-by-step teacher/companion. I’ll keep things simple, small steps, and give copy-pasteable code and checklist you can use right away. I’ll assume the external “party master” will send an event (JSON) to our app (HTTP POST or Kafka). If their transport differs you can swap the adapter — the core rule logic stays the same.


---

Quick plan (what we’ll build now)

1. Multi-module Gradle Spring Boot project (hexagonal): domain, application, adapter.


2. Domain: plain Java domain models & repository interfaces.


3. Application: rule engine service + Drools config + rules (.drl).


4. Adapter: inbound controller (HTTP) + optional Kafka listener + DB JPA adapter + workflow HTTP client.


5. Test by POSTing sample JSON -> rules run -> workflow HTTP call + DB save.



I’ll give the minimal scaffold + working code snippets to drop into your repo. Do them in order.


---

Assumptions (so we don’t block)

You’ll use Gradle multi-module (images show that layout).

Event arrives as JSON POST to our app (/events/party) — you can replace with Kafka later.

You will add actual workflow API URL and DB details later; I’ll show call sites and a mock example.



---

1 — Project modules (create these)

settings.gradle at root:

rootProject.name = 'valpre-rules-eng-app'
include 'domain', 'application', 'adapter'

Root build.gradle (keep minimal, version placeholders):

plugins {
  id 'org.springframework.boot' version '3.1.0' apply false
  id 'io.spring.dependency-management' version '1.1.0' apply false
  id 'java'
}

subprojects {
  apply plugin: 'java'
  sourceCompatibility = '17' // or your Java version
}

Each module will have its own build.gradle — I’ll show specific ones below where needed.


---

2 — Domain module (pure Java)

Path: domain/src/main/java/com/company/rules/domain/...

ProspectEvent.java

package com.company.rules.domain;

import java.util.Map;

public class ProspectEvent {
    private String id;
    private String businessSegment;
    private String bookingCenter;
    private String prospectType;
    private Map<String,Object> payload; // other fields

    // getters + setters (or generate)
}

WorkflowAction.java (result produced by rules)

package com.company.rules.domain;

import java.util.List;
public class WorkflowAction {
    private String actionType; // e.g., CREATE_JOURNEY
    private String journeyType;
    private List<String> tasks;
    // getters + setters
}

ProspectRepository.java (domain port)

package com.company.rules.domain;

public interface ProspectRepository {
    void saveProspectRecord(ProspectRecord record);
}

ProspectRecord.java (plain DTO)

package com.company.rules.domain;
import java.time.Instant;
public class ProspectRecord {
   private String id;
   private String businessSegment;
   private String bookingCenter;
   private String status;
   private Instant createdAt;
   // getters/setters
}


---

3 — Application module: rules and service

Path: application/src/main/...

application/build.gradle (important deps)

plugins { id 'java' }
dependencies {
  implementation project(':domain')
  implementation 'org.kie:kie-api:7.79.0.Final'            // pick a current drools/kie version
  implementation 'org.drools:drools-core:7.79.0.Final'
  implementation 'org.drools:drools-compiler:7.79.0.Final'
}

(Adjust version to the one you use in company — your build may already have BOM.)

DroolsConfig.java — create KieContainer bean

package com.company.rules.application.config;

import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DroolsConfig {
    @Bean
    public KieContainer kieContainer() {
        KieServices ks = KieServices.Factory.get();
        return ks.getKieClasspathContainer();
    }
}

RuleEngineService.java

package com.company.rules.application;

import com.company.rules.domain.ProspectEvent;
import com.company.rules.domain.WorkflowAction;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RuleEngineService {
    private final KieContainer kieContainer;

    public RuleEngineService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public List<WorkflowAction> applyRules(ProspectEvent event) {
        KieSession kieSession = kieContainer.newKieSession(); // session per request
        try {
            kieSession.setGlobal("results", new ArrayList<WorkflowAction>());
            kieSession.insert(event);
            kieSession.fireAllRules();
            @SuppressWarnings("unchecked")
            List<WorkflowAction> results = (List<WorkflowAction>) kieSession.getGlobal("results");
            return results;
        } finally {
            kieSession.dispose();
        }
    }
}

Where to put rules: application/src/main/resources/rules/prospect-rules.drl

Example prospect-rules.drl (simple, readable)

package rules

import com.company.rules.domain.ProspectEvent;
import com.company.rules.domain.WorkflowAction;
import java.util.Arrays;

global java.util.List results;

rule "Onboard PBUK London"
when
    $p : ProspectEvent(businessSegment == "PBUK", bookingCenter == "London")
then
    WorkflowAction a = new WorkflowAction();
    a.setActionType("CREATE_JOURNEY");
    a.setJourneyType("Onboarding");
    a.setTasks(Arrays.asList("FCRA","KYC","DOC_REVIEW"));
    results.add(a);
    // You may also modify event properties if needed
end

> Put simple readable rules — based on your image D2 you’ll add more conditions and actions similar to the above.




---

4 — Adapter module: inbound HTTP + DB + workflow call

Path: adapter/src/main/...

adapter/build.gradle:

plugins {
  id 'org.springframework.boot' version '3.1.0'
  id 'io.spring.dependency-management' version '1.1.0'
}
dependencies {
  implementation project(':domain')
  implementation project(':application')
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
  runtimeOnly 'com.h2database:h2' // for quick test — replace with your DB
  // optional Kafka if you want:
  // implementation 'org.springframework.kafka:spring-kafka'
  // For calling external workflow:
  implementation 'org.springframework.boot:spring-boot-starter-webflux' // WebClient
}

Inbound controller (HTTP)

package com.company.rules.adapter.inbound;

import com.company.rules.domain.ProspectEvent;
import com.company.rules.application.RuleEngineService;
import com.company.rules.domain.WorkflowAction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final RuleEngineService ruleEngine;
    private final WorkflowClient workflowClient;
    private final ProspectRepositoryAdapter repoAdapter;

    public EventController(RuleEngineService ruleEngine,
                           WorkflowClient workflowClient,
                           ProspectRepositoryAdapter repoAdapter) {
        this.ruleEngine = ruleEngine;
        this.workflowClient = workflowClient;
        this.repoAdapter = repoAdapter;
    }

    @PostMapping("/party")
    public ResponseEntity<Void> handlePartyEvent(@RequestBody ProspectEvent ev) {
        List<WorkflowAction> actions = ruleEngine.applyRules(ev);
        // call workflow(s) and save db
        for (WorkflowAction a : actions) {
            workflowClient.triggerWorkflow(a);
        }
        // store a simple record
        repoAdapter.saveProspectRecord(new com.company.rules.domain.ProspectRecord() {{
            setId(ev.getId());
            setBusinessSegment(ev.getBusinessSegment());
            setBookingCenter(ev.getBookingCenter());
            setCreatedAt(java.time.Instant.now());
        }});
        return ResponseEntity.accepted().build();
    }
}

WorkflowClient.java (simple)

package com.company.rules.adapter.inbound;

import com.company.rules.domain.WorkflowAction;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class WorkflowClient {
    private final WebClient webClient;

    public WorkflowClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://workflow-service") // change to real URL
                                 .build();
    }

    public void triggerWorkflow(WorkflowAction action) {
        // For EOD quickness, a blocking call is simplest:
        webClient.post()
                 .uri("/api/workflows")
                 .bodyValue(action)
                 .retrieve()
                 .bodyToMono(Void.class)
                 .onErrorResume(e -> Mono.empty())
                 .block(); // blocking is okay for simple prototype
    }
}

DB adapter implementing domain port

package com.company.rules.adapter.persistence;

import com.company.rules.domain.ProspectRecord;
import com.company.rules.domain.ProspectRepository;
import org.springframework.stereotype.Component;

@Component
public class ProspectRepositoryAdapter implements ProspectRepository {
    private final ProspectJpaRepository jpa;

    public ProspectRepositoryAdapter(ProspectJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void saveProspectRecord(ProspectRecord record) {
        ProspectEntity e = new ProspectEntity();
        e.setId(record.getId());
        e.setBusinessSegment(record.getBusinessSegment());
        e.setBookingCenter(record.getBookingCenter());
        e.setCreatedAt(record.getCreatedAt());
        jpa.save(e);
    }
}

ProspectEntity + JPA repo

@Entity
@Table(name="prospect")
public class ProspectEntity {
    @Id
    private String id;
    private String businessSegment;
    private String bookingCenter;
    private Instant createdAt;
    // getters/setters
}

public interface ProspectJpaRepository extends JpaRepository<ProspectEntity, String> {}


---

5 — Run & test (quick)

1. Put the DRL file in application/src/main/resources/rules/prospect-rules.drl.


2. Build and run adapter (it runs app and brings other modules):



./gradlew :adapter:bootRun

3. Test with curl:



curl -X POST http://localhost:8080/events/party \
  -H "Content-Type: application/json" \
  -d '{"id":"p1","businessSegment":"PBUK","bookingCenter":"London","prospectType":"NEW"}'

Expect: 202 Accepted + your workflow client will be called and DB row created in H2 (or your DB).


---

6 — Checklist to deliver today (do these 6)

1. Add the simple scaffolding code above into respective modules.


2. Add the sample prospect-rules.drl and expand rules per image D2 (each rule -> creates WorkflowAction with tasks).


3. Wire actual workflow URL (replace http://workflow-service) or mock it.


4. Replace H2 with your DB and set spring.datasource.* in application.properties.


5. Start app and POST sample event; confirm DB row + workflow call logs.


6. If party master will use Kafka, add a @KafkaListener in adapter that maps message -> call RuleEngineService.




---

Short notes / tips (so it doesn’t break)

KieSession is NOT thread safe — always kieContainer.newKieSession() and dispose() per request.

Keep rules small and readable. Use domain objects as facts.

Keep domain module free of Spring to preserve hexagonal design.

If you expect many rules/changes, keep rules in files by topic: onboarding.drl, validation.drl, etc.

To debug rules, add logging inside rules: System.out.println(...) or use logger in rule consequence.



---

If you want, I’ll:

generate the full folder + files as a single copy/pasteable scaffold,

or convert the HTTP adapter to Kafka listener stub,

or help you convert the DRL rules from the Excel screenshot (I can transcribe those conditions → rules).


Which do you want next: full scaffold (all files ready to paste) OR I should transcribe the rules from your screenshots into DRL rules now? (I can do the transcription for you immediately.)

