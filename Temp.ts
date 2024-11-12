basename='/pbwm/launcher/identity-verification'>

Indexs/src/index.html,

basestrefs/pbwn/launcher/identity-verification'


const CustomCaseStatus = (item: any) => {
    if (!item) return null;

    const renderTile = (theme: React.ElementType) => (
        <theme>
            <Tile>
                <Tile.Content>
                    <Type size="sm">&nbsp;&nbsp;{item}</Type>
                </Tile.Content>
            </Tile>
        </theme>
    );

    switch (item) {
        case caseStatus.AWAITINGINPUT:
        case caseStatus.PROCESSING:
        case caseStatus.CASECREATED:
            return renderTile(BarclaysLegacyMicroThemeInfo);

        case caseStatus.APPROVED:
            return renderTile(BarclaysLegacyMicroThemeSuccess);

        case caseStatus.ERROR:
        case caseStatus.ABANDONED:
        case caseStatus.LINKEXPIRED:
            // Add specific handling logic or a return statement here if necessary
            break;

        default:
            return null;
    }
};