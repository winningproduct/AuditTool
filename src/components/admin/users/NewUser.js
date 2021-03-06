import React, { Component } from 'react';
import FormErrors from "../../FormErrors";
import Validate from "../../utility/FormValidation";
import { Auth, API } from "aws-amplify";
import Spinner from '../../utility/Spinner';

class NewUser extends Component {
  state = {
    email: "",
    loading: false,
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true})
    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    const username = this.state.email;
    const email = this.state.email;
    const password = `test${this.state.email}`;
    try {
      await Auth.signUp( {username, password ,
        attributes: {
          email: email,
          'custom:organization': this.props.user.attributes['custom:organization'],
          'custom:admin': 'false'
      }});
      await API.post("UserApi", "/users", {
        body: {
          pk: "User",
          sk: "Org-" + this.props.user.attributes['custom:organization'] + '-' + Date.now().toString(),
          email: this.state.email,
        }
      });
      this.setState({ email: "" , loading: false});
    } catch (error) {
      console.log(error)
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        loading: false,
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Create a new user</h1>
          <FormErrors formerrors={this.state.errors} />
          {
            !this.state.loading ? (
              <form onSubmit={this.handleSubmit}>
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email of a New user"
                    value={this.state.email}
                    onChange={this.onInputChange}
                  />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-success">
                    New User
                  </button>
                </p>
              </div>
            </form>
            )
            :
            <Spinner />
          }
        </div>
      </section>
    );
  }
}

export default NewUser;