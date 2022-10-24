import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import Clock from "../components/Clock";

const socketServerUrl = "http://localhost:9000";
const BASE_URL = "http://localhost:9000/questions/";

const config = {
  secure: true,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
};

let socket = io(socketServerUrl, config);
socket.on("connect", () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});

function Students() {
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    socket.on("server-message", (data) => {
      if (data.type === "quiz") {
        setQuestions(data.questions);
        setIsPlaying(true);
      }
    });
  }, []);

  const { handleSubmit, register } = useForm();
  const onSubmit = (data) => {
    setUsername(data.username);
  };

  return (
    <Container
      className="animate__animated animate__fadeIn"
      maxW="2xl"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={100}
      height="100vh"
    >
      <Box>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", gap: 5 }}
        >
          <InputGroup>
            <InputLeftAddon>Student Name</InputLeftAddon>
            <Input
              {...register("username")}
              required
              disabled={username !== ""}
              w="100%"
            />
          </InputGroup>
          <Button type="submit" w="1rem" colorScheme="facebook">
            Add
          </Button>
        </form>

        <Text fontSize="xs" color="#314e89">
          <Badge colorScheme="yellow" borderRadius="50%">
            !
          </Badge>
          Add your name and wait for the question from teacher!
        </Text>
        <Text fontSize="xs" color="#314e89">
          <Badge colorScheme="yellow" borderRadius="50%">
            !!
          </Badge>
          Only click answer once for each question!
        </Text>
        <Text fontSize="xs" color="#314e89">
          <Badge colorScheme="yellow" borderRadius="50%">
            !!!
          </Badge>
          Click OK when the alert box appear and wait for the next question!
        </Text>
      </Box>
      {isPlaying && (
        <Clock
          onStop={() => {
            alert("TIME-OUT, WAIT FOR THE NEXT QUESTION");
            setIsPlaying(false);
            setDisableBtn(false);
          }}
        />
      )}
      <Box>
        {questions && (
          <>
            <Text fontSize="2xl" fontWeight={600}>
              {questions.title}
            </Text>
            <Grid templateColumns="repeat(2,minmax(0,1fr))" gap={3}>
              {questions.options.map((question) => {
                return (
                  <GridItem key={question._id}>
                    <Button
                      w="100%"
                      onClick={async () => {
                        await axios.post(`${BASE_URL}answer`, {
                          username: username,
                          question: question._id,
                          score: question.isCorrect ? question.score : 0,
                        });
                        socket.emit("client-message", {
                          type: "quiz-answer",
                          username: username,
                          question,
                        });
                        setDisableBtn(true);
                      }}
                      disabled={disableBtn}
                    >
                      {question.text}
                    </Button>
                  </GridItem>
                );
              })}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Students;
