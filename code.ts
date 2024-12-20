import {
  Center,
  VStack,
  Text,
  Input,
  Box,
  Image,
  Button,
  HStack,
} from "@chakra-ui/react";
import React from "react";

const CertificatePage = () => {
  const [userName, setUserName] = React.useState("");
  const [previewPhoto, setPreviewPhoto] = React.useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleDownload = () => {
    // Add your download logic here
    console.log("Downloading Certificate...");
  };

  const handleReset = () => {
    setUserName("");
    setPreviewPhoto(null);
  };

  return (
    <Center p={[4, 6]} flexDirection="column">
      <VStack spacing={6} mb={6} w={["90%", "70%", "50%"]}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" textAlign="center">
          Create Your Certificate
        </Text>
        <Input
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          size="lg"
          variant="outline"
          borderColor="blue.500"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          size="lg"
          borderColor="blue.500"
        />
      </VStack>

      <Box
        id="certificate-template"
        w={["90%", "500px"]}
        h={["200px", "300px"]}
        border="2px solid"
        borderColor="gray.300"
        p={4}
        position="relative"
        textAlign="center"
        bgImage="url('your-certificate-background-url.jpg')"
        bgSize="cover"
        bgPos="center"
      >
        {previewPhoto && (
          <Image
            src={previewPhoto}
            alt="Profile"
            position="absolute"
            top="20px"
            left="20px"
            w="80px"
            h="80px"
            borderRadius="full"
            objectFit="cover"
            border="2px solid"
            borderColor="white"
          />
        )}
        <Text
          position="absolute"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          fontSize={["md", "xl"]}
          fontWeight="bold"
        >
          {userName || "Your Name Here"}
        </Text>
      </Box>

      <HStack mt={6} spacing={4}>
        <Button
          onClick={handleDownload}
          variant="outline"
          colorScheme="blue"
          size="lg"
          borderRadius="md"
          isDisabled={!userName || !previewPhoto} // Disable if no name or image
        >
          Download Certificate
        </Button>
        <Button
          onClick={handleReset}
          variant="solid"
          colorScheme="red"
          size="lg"
          borderRadius="md"
        >
          Reset
        </Button>
      </HStack>
    </Center>
  );
};

export default CertificatePage;