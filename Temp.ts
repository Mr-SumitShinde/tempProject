basename='/pbwm/launcher/identity-verification'>

Indexs/src/index.html,

basestrefs/pbwn/launcher/identity-verification'



const CustomCaseStatus = (item: any) => {
    let status = item;

    switch (status) {
        case caseStatus.AWAITINGINPUT:
        case caseStatus.PROCESSING:
        case caseStatus.CASECREATED:
            return (
                item && (
                    <BarclaysLegacyMicroThemeInfo>
                        <Tile>
                            <Tile.Content>
                                <Type size="sm">&nbsp;&nbsp;{item}</Type>
                            </Tile.Content>
                        </Tile>
                    </BarclaysLegacyMicroThemeInfo>
                )
            );

        case caseStatus.APPROVED:
            return (
                item && (
                    <BarclaysLegacyMicroThemeSuccess>
                        <Tile>
                            <Tile.Content>
                                <Type size="sm">&nbsp;&nbsp;{item}</Type>
                            </Tile.Content>
                        </Tile>
                    </BarclaysLegacyMicroThemeSuccess>
                )
            );

        case caseStatus.ERROR:
        case caseStatus.ABANDONED:
        case caseStatus.LINKEXPIRED:
            // Add your specific return or handling logic here if needed
            break;

        default:
            return null; // Default return if none of the cases match
    }
};