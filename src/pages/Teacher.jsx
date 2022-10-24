import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import {
  Container,
  Button,
  Grid,
  GridItem,
  Text,
  Badge,
  Box,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Input,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import Clock from "../components/Clock";

const socketServerUrl = "http://localhost:9000";
const BASE_URL = "http://localhost:9000/questions/";

const config = {
  secure: true,
  reconnect: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
};

let socket = io(socketServerUrl, config);
socket.on("connect", () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});

function Teacher() {
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);

  //MOUNT/UNMOUNT COMPONENT CLOCK
  const [isPlaying, setIsPlaying] = useState(false);

  //OPEN-CLOSE MODAL
  const { isOpen, onOpen, onClose } = useDisclosure();

  //FORM
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      score: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "options",
  });
  const onSubmitPost = (data, e) => {
    e.preventDefault();
    handlePost(data);
    toast.success("Successfully Add New Question!");
    reset();
    setRefresh((f) => f + 1);
  };
  //END

  //LISTEN THE ANSWER OF STUDENT FROM SERVER
  useEffect(() => {
    socket.on("server-message", (data) => {
      if (data.type === "quiz-answer") {
        const tmp = answers;
        tmp.push(data);
        setAnswers([...tmp]);
      }
    });
  }, []);
  //END

  //GET DATA
  useEffect(() => {
    axios.get(BASE_URL).then((res) => {
      setQuestions(res.data);
    });
  }, [refresh]);
  //END

  //POST NEW DATA
  const handlePost = async (data) => {
    await axios.post(BASE_URL, data);
  };

  //DELETE DATA
  const handleDelete = async (selectedRow) => {
    await axios.delete(BASE_URL + selectedRow);
  };

  return (
    <Container className="animate__animated animate__fadeIn" maxW="2xl" pt={10}>
      <Toaster position="top-center" reverseOrder={false} />

      <Flex justifyContent="flex-end" mb={3}>
        <Button colorScheme="facebook" onClick={onOpen}>
          Add New Question
        </Button>

        {/* FORM TO POST DATA */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent p="2rem">
            <form onSubmit={handleSubmit(onSubmitPost)}>
              <Grid>
                <GridItem>
                  <label>Question: </label>
                  <Controller
                    render={({ field }) => (
                      <Input type="text" {...field} required height="100px" />
                    )}
                    name="title"
                    control={control}
                  />
                </GridItem>
                <GridItem>
                  <label>Score: </label>
                  <Controller
                    render={({ field }) => (
                      <Input type="number" {...field} required />
                    )}
                    name="score"
                    control={control}
                  />
                </GridItem>
              </Grid>
              <ul>
                {fields.map((item, index) => {
                  return (
                    <li
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 0",
                      }}
                    >
                      <label>Answer: </label>
                      <Controller
                        render={({ field }) => <Input type="text" {...field} />}
                        name={`options.${index}.text`}
                        control={control}
                      />
                      <Controller
                        render={({ field }) => (
                          <input type="checkbox" {...field} />
                        )}
                        name={`options.${index}.isCorrect`}
                        control={control}
                      />
                    </li>
                  );
                })}
              </ul>
              <Text fontSize="xs" color="blue">
                <Badge colorScheme="purple" borderRadius="50%">
                  !
                </Badge>
                Tick to the checkbox if the answer is correct!
              </Text>
              <Button colorScheme="facebook" type="submit" w="100%" mt={4}>
                Submit
              </Button>
            </form>
          </ModalContent>
        </Modal>
      </Flex>

      <Grid gap={5}>
        {questions.map((question, index) => {
          return (
            <Grid key={question._id} gridTemplateColumns="93% 7%" gap={1}>
              <GridItem>
                <Text fontWeight={600}>
                  <Badge
                    mr={2}
                    colorScheme={questionIndex === index ? "green" : "gray"}
                  >
                    {index + 1}
                  </Badge>
                  {question.title}
                </Text>
              </GridItem>
              <GridItem>
                <Popover>
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          w="100%"
                          onClick={() => setSelectedRow(question._id)}
                        >
                          x
                        </Button>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverHeader fontWeight={700}>
                            Confirmation
                          </PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            Are you sure you want to continue with your action?
                          </PopoverBody>
                          <PopoverFooter>
                            <Button
                              w="100%"
                              onClick={() => {
                                handleDelete(selectedRow);
                                setRefresh((f) => f + 1);
                                toast.success("Successfully delete!");
                                onClose();
                              }}
                            >
                              Agree
                            </Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Portal>
                    </>
                  )}
                </Popover>
              </GridItem>
            </Grid>
          );
        })}

        {/* CLOCK COMPONENT */}
        {isPlaying && (
          <Clock
            onStop={() => {
              alert("TIME-OUT");
              setIsPlaying(false);
            }}
          />
        )}
      </Grid>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={10}
        border="1px dashed brown"
        borderRadius={5}
      >
        <Text fontSize="3xl" fontWeight={600}>
          Choose Question...
        </Text>
        <Box display="flex" gap={10} padding="1rem 0px">
          <Button
            colorScheme="teal"
            onClick={() => {
              setQuestionIndex(
                questionIndex === 0 ? questions.length - 1 : questionIndex - 1
              );
            }}
          >
            Privious
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              setQuestionIndex(
                questionIndex === questions.length - 1 ? 0 : questionIndex + 1
              );
            }}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Button
        mt={10}
        width="100%"
        colorScheme="teal"
        onClick={async () => {
          await socket.emit("client-message", {
            type: "quiz",
            questions: questions[questionIndex],
          });
          setIsPlaying(true);
        }}
      >
        START
      </Button>

      <TableContainer border="1px solid #fff" borderRadius="5px" mt={10}>
        <Table variant="simple">
          <TableCaption fontSize="xl">The Student Answer Sheet</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Student Name</Th>
              <Th>True/False</Th>
            </Tr>
          </Thead>
          {answers.map((answer, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{answer.username}</Td>
                  <Td>{answer.question.isCorrect.toString()}</Td>
                </Tr>
              </Tbody>
            );
          })}
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Teacher;
