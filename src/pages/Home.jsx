import React from "react";
import { Link } from "react-router-dom";

import { Container, Box, Button, Text, Flex } from "@chakra-ui/react";

function Home() {
  return (
    <Container
      className="animate__animated animate__fadeInLeftBig"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      maxW="container.md"
    >
      <Box
        w="70vw"
        height="30vh"
        background="linear-gradient(#d7e1ec, #ffffff)"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
        borderRadius="10px"
      >
        <Text fontSize="5xl" color="brown" fontWeight="600" letterSpacing={3}>
          MINI QUIZZZZZ
        </Text>
        <Text fontSize="3xl" color="brown">YOU ARE: </Text>
        <Flex gap={10}>
          <Link to="/teacher">
            <Button colorScheme="linkedin">TEACHER</Button>
          </Link>
          <Link to="/students">
            <Button colorScheme="messenger">STUDENT</Button>
          </Link>
        </Flex>
      </Box>
    </Container>
  );
}

export default Home;
