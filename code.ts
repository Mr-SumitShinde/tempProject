import React, { useEffect, useState } from "react";
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
import certificateBg from "./assets/certificate-bg.jpg";

const CertificatePage = () => {
  const [userName, setUserName] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Dynamically get the dimensions of the background image
  useEffect(() => {
    const img = new Image();
    img.src = certificateBg;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleDownload = () => {
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
        w={`${dimensions.width}px`}
        h={`${dimensions.height}px`}
        border="2px solid"
        borderColor="gray.300"
        p={4}
        position="relative"
        textAlign="center"
        bgImage={`url(${certificateBg})`}
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
          isDisabled={!userName || !previewPhoto}
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