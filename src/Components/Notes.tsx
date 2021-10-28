import { message, Input, Button, Modal, Space, Card } from "antd";
import axios from "axios";
import {
  CopyTwoTone,
  DeleteFilled,
  DeleteTwoTone,
  EditTwoTone,
  FileAddTwoTone,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { MainContainer } from "./Login";
const { TextArea } = Input;
const { Meta } = Card;

const isLoggedIn = () => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    return true;
  }
  return false;
};

const getAuthToken = () => {
  const authToken = localStorage.getItem("authToken");
  return authToken;
};

// Interfaces
interface State {
  newNote: newNote;
  notes: Array<Note>;
  modalVisible: boolean;
  isLoading: boolean;
  fetch: boolean;
  editIndex: number | null;
}

interface newNote {
  title: string;
  description: string;
  tag: string;
}
interface Note {
  title: string;
  description: string;
  tag: string;
  timeStamp: string;
  user: string;
  _id: string;
}
interface item {
  msg: string;
}

//  Notes Function Starts Here
export default function Notes() {
  // Variable Declaration
  const isLogin = isLoggedIn();
  const authToken = getAuthToken();
  const history = useHistory();

  // State Management
  const [state, setState] = useState<State>({
    newNote: {
      title: "",
      description: "",
      tag: "General",
    },
    notes: [],
    modalVisible: false,
    isLoading: false,
    fetch: false,
    editIndex: null,
  });

  useEffect(() => {
    if (!isLogin) {
      message.warning("Please Login First To Use All Features");
      history.replace("/login");
    }
  }, [isLogin, history]);

  // STYLED COMPONENTS HERE
  const SemiMainContainer = styled.div`
    height: 98%;
    width: 98%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  `;

  const NotesDisplay = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: auto;
    justify-content: safe;
    align-items: flex-start;
    width: 100%;
    height: 93%;
    /* border: 1px solid red; */
  `;

  const DisplayTag = styled.span`
    color: blue;
    border: 1px solid blue;
    border-radius: 5px;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    user-select: none;
    padding: 2px;
  `;

  // Logical Coding Starts

  useEffect(() => {
    const getNotes = async () => {
      const url = "/api/notes/getNotes";
      const headers = {
        "auth-token": authToken as string,
      };
      await axios
        .get(url, { headers })
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            notes: res.data.map((item: Note) => {
              return {
                title: item.title,
                tag: item.tag,
                description: item.description,
                _id: item._id as string,
                timeStamp: item.timeStamp.toString().substring(0, 10),
                user: item.user as string,
              };
            }),
          }));
        })
        .catch((err) => console.log({ err }));

      console.log(state);
    };
    getNotes();
  }, [state.fetch, authToken]);

  // Creating Note
  const createNote = async () => {
    console.log(state.notes[0]);

    const url = "/api/notes/createNote";
    const headers = {
      "Content-Type": "application/json",
      "auth-token": authToken as string,
    };
    const body = {
      title: state.newNote.title,
      tag: state.newNote.tag,
      description: state.newNote.description,
    };
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await axios
    .post(url, body, { headers })
    .then((res) => {
      message.success("Note Created");
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        fetch: !state.fetch,
        modalVisible: false,
        newNote: { title: "", tag: "General", description: "" },
      }));
    })
    .catch((err) => {
        setState((prevState) => ({ ...prevState, isLoading: false }));
        err.response.data.error
          ? message.error(err.response.data.error)
          : err.response.data.errors.map((item: item) =>
              message.error(item.msg)
            );
      });
  };

  // Deleting Note
  const deleteNote = async (index: number) => {
    const url = `/api/notes/deleteNote/${state.notes[index]._id}`;
    const headers = {
      "auth-token": authToken as string,
    };
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await axios
    .delete(url, { headers })
    .then((res) => {
      message.success("Note Deleted");
      setState((prev) => ({ ...prev, fetch: !state.fetch, isLoading: false }));
    })
    .catch((err) => {
        setState((prevState) => ({ ...prevState, isLoading: false }));
        err.response.data.error
          ? message.error(err.response.data.error)
          : err.response.data.errors.map((item: item) =>
              message.error(item.msg)
            );
      });
  };

  // Updating the Note
  const editNote = async () => {
    const index = state.editIndex;
    if (index === null) {
      return null;
    }
    const url = `/api/notes/updateNote/${state.notes[index]._id}`;
    const headers = {
      "content-type": "application/json",
      "auth-token": authToken as string,
    };
    const body = {
      title: state.newNote.title,
      description: state.newNote.description,
      tag: state.newNote.tag,
    };

    setState((prevState) => ({ ...prevState, isLoading: true }));
    await axios
    .put(url, body, { headers })
    .then((res) => {
        message.success("Note Updated");
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          fetch: !state.fetch,
          modalVisible: false,
          newNote: { title: "", tag: "General", description: "" },
        }));
      })
      .catch((err) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        err.response.data.error
          ? message.error(err.response.data.error)
          : err.response.data.errors.map((item: item) =>
              message.error(item.msg)
            );
      });

    setState((prev) => ({ ...prev, editIndex: null }));
  };

  return (
    <MainContainer>
      <Modal
        title="Create New Note"
        visible={state.modalVisible}
        confirmLoading={state.isLoading}
        onOk={state.editIndex !== null ? editNote : createNote}
        onCancel={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: false,
            newNote: { title: "", tag: "General", description: "" },
          }))
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            addonBefore="Title"
            onPressEnter={state.editIndex !== null ? editNote : createNote}
            value={state.newNote.title}
            allowClear
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                newNote: { ...state.newNote, title: e.target.value },
              }))
            }
          />

          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            // onPressEnter={state.editIndex !== null ? editNote : createNote}
            value={state.newNote.description}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                newNote: { ...state.newNote, description: e.target.value },
              }))
            }
            allowClear
            placeholder="Description"
          />

          <Input
            addonBefore="Tag"
            onPressEnter={state.editIndex !== null ? editNote : createNote}
            allowClear
            value={state.newNote.tag}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                newNote: { ...state.newNote, tag: e.target.value },
              }))
            }
          />
        </Space>
      </Modal>
      <SemiMainContainer>
        <Button
          type="dashed"
          icon={<FileAddTwoTone />}
          onClick={() =>
            setState((prevState) => ({ ...prevState, modalVisible: true }))
          }
        >
          New Note
        </Button>
        <NotesDisplay>
          {state.notes.map((item, index) => {
            return (
              <Card
                title={
                  <>
                    <span style={{ fontSize: "16px" }}>{item.title}</span>
                    <DisplayTag>{item.tag}</DisplayTag>
                  </>
                }
                // actions={["copy", "edit", "delete"]}
                style={{
                  margin: "5px",
                  height: "250px",
                  width: "250px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "200px",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "95%",
                      textJustify: "inter-word",
                      height: "100%",
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                  >
                    <p>{item.description}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "35px",
                      justifyContent: "space-evenly",
                      marginBlock: "5px",
                    }}
                  >
                    <Button>
                      <CopyTwoTone />
                    </Button>
                    <Button
                      onClick={() =>
                        setState((prevState) => ({
                          ...prevState,
                          modalVisible: true,
                          editIndex: index,
                          newNote: {
                            title: state.notes[index].title,
                            tag: state.notes[index].tag,
                            description: state.notes[index].description,
                          },
                        }))
                      }
                    >
                      <EditTwoTone />
                    </Button>
                    <Button
                      danger
                      loading={state.isLoading}
                      type="primary"
                      onClick={() => deleteNote(index)}
                    >
                      <DeleteFilled />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </NotesDisplay>
      </SemiMainContainer>
    </MainContainer>
  );
}
