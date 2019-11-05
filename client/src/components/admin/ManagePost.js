import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts, publishPost } from "../../actions/postActions";
import PostButton from "../common/OptionPostButton";
import NavBar from "./NavBar";
import ReactTable from "react-table";
import Spinner from "../common/Spinner";
import SimpleDialog from "./DialogPost";
import "./style.scss";
import "react-table/react-table.css";
class ManagePost extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentId: null,
      opent: false
    };
  }
  componentDidMount() {
    if (this.props.match.path === "/dashboard_admin/manage_post") {
      document.getElementById("root-app").style.background = "#f1f2f7";
    }
    this.props.getPosts();
  }
  componentWillUnmount() {
    document.getElementById("root-app").style.background =
      "linear-gradient(to right, rgb(78, 205, 196), rgb(85, 98, 112))";
  }
  onPublishPost = id => {
    const postData = {
      postId: id,
      published: true
    };
    this.props.publishPost(postData);
  };
  onUnpublishPost = id => {
    const postData = {
      postId: id,
      published: false
    };
    this.props.publishPost(postData);
  };
  onViewAdmin = id => {
    this.setState({
      open: true,
      currentId: id
    });
  };
  handleClose = value => {
    this.setState({ open: false });
  };
  render() {
    const { posts, loading } = this.props.post;
    console.log(posts);
    return (
      <div className="dashboard" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <div
            className="col-md-2"
            style={{
              background: "#fff",
              boxShadow: "5px 0 10px rgba(0,0,0,.1)"
            }}
          >
            <NavBar />
          </div>
          <SimpleDialog
            currentId={this.state.currentId}
            open={this.state.open}
            onClose={this.handleClose}
          />
          <div className="col-md-10">
            <div className="profiles">
              <div className="container">
                <h2 className="my-3 text-center">Manage Post</h2>
                <div
                  className="mt-4"
                  style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "4px",
                    background: "#fff"
                  }}
                >
                  {posts && !loading ? (
                    <ReactTable
                      className="react-table-users"
                      columns={[
                        {
                          Header: "Avatar",
                          Cell: row => {
                            return (
                              <div className="wrapper-avat">
                                <img
                                  alt="Avatar"
                                  className="rounded-circle"
                                  style={{ width: "50px", height: "50px" }}
                                  src={row.original.avatar}
                                />
                              </div>
                            );
                          },
                          id: "avatar",
                          width: 100
                        },
                        {
                          id: "name",
                          Header: "Name",
                          Cell: row => {
                            return <p>{row.original.name}</p>;
                          }
                        },
                        {
                          id: "subject",
                          Header: "Subject",
                          Cell: row => {
                            return <p>{row.original.subject}</p>;
                          }
                        },
                        {
                          id: "tags",
                          Header: "Tags",
                          Cell: row => {
                            return (
                              <p>
                                {row.original.tags.map(tags => {
                                  return `${tags.value} `;
                                })}
                              </p>
                            );
                          }
                        },
                        {
                          Header: "Action",
                          Cell: row => {
                            return (
                              <PostButton
                                id={row.original._id}
                                isPublished={row.original.published}
                                onView={this.onViewAdmin}
                                onPublish={this.onPublishPost}
                                onUnpublish={this.onUnpublishPost}
                              />
                            );
                          },
                          id: "action"
                        }
                      ]}
                      data={posts}
                      defaultPageSize={5}
                      loading={loading}
                      loadingText="loading"
                    >
                      {(state, makeTable, instance) => {
                        return (
                          <div
                            style={{
                              background: "#fff",
                              padding: "12px 16px"
                            }}
                          >
                            {makeTable()}
                          </div>
                        );
                      }}
                    </ReactTable>
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManagePost.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPosts, publishPost }
)(ManagePost);
