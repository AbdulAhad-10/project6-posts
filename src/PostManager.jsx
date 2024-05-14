import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, List, Modal, Typography } from "antd";

const { Title } = Typography;

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreate = () => {
    setModalMode("create");
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (post) => {
    setModalMode("edit");
    form.setFieldsValue({
      userId: post.userId,
      id: post.id,
      title: post.title,
      body: post.body,
    });
    setEditingPost(post);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Simulate a DELETE request
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalMode === "create") {
        // Simulate a POST request
        const { data: newPost } = await axios.post(
          "https://jsonplaceholder.typicode.com/posts",
          {
            userId: 1, // Assuming a default userId for new posts
            ...values,
          }
        );
        setPosts([...posts, newPost]);
      } else {
        // Simulate a PUT request
        const { data: updatedPost } = await axios.put(
          `https://jsonplaceholder.typicode.com/posts/${editingPost.id}`,
          values
        );
        const updatedPosts = posts.map((post) =>
          post.id === editingPost.id ? updatedPost : post
        );
        setPosts(updatedPosts);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Title level={2}>Posts</Title>
      <Button type="primary" onClick={handleCreate}>
        Add Post
      </Button>
      <List
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => handleEdit(post)}
                key={post.id}
              >
                Edit
              </Button>,
              <Button
                type="danger"
                onClick={() => handleDelete(post.id)}
                key={post.id}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={post.title} description={post.body} />
          </List.Item>
        )}
      />
      <Modal
        title={modalMode === "create" ? "Create Post" : "Edit Post"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: "Please enter the post body" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostsManager;
