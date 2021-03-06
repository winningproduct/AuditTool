import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Link } from 'react-router-dom';
import { Auth } from "aws-amplify";
import Welcome from './Welcome';
import uuid from 'react-uuid'
import Spinner from '../utility/Spinner';

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    isSubmitted: false,
    loading : false,
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false,
      minlength: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false,
        minlength: false
      }
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({loading : true })

    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    const { username, email, password } = this.state;
    const orgKey = uuid();
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: email,
          'custom:organization': orgKey,
          'custom:admin': 'true'
        }
      });
      this.setState({loading: false , isSubmitted: true })
    } catch (error) {
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
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }

  render() {
    return (
      !this.state.loading ?
      this.state.isSubmitted ? <Welcome username={this.state.username} {...this.props} /> :
        <section className="section auth">
          <div className="container">
            <h1>Register</h1>
            <FormErrors formerrors={this.state.errors} />

            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    id="username"
                    aria-describedby="userNameHelp"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.onInputChange}
                  />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="email"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.onInputChange}
                  />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onInputChange}
                  />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="password"
                    id="confirmpassword"
                    placeholder="Confirm password"
                    value={this.state.confirmpassword}
                    onChange={this.onInputChange}
                  />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <Link to="/forgotpassword">Forgot password?</Link>
                </p>
              </div>
              <div className="field">
              <p className="control">
                Already User ? <Link to="/login"> Sign-In</Link>
              </p>
            </div>
              <div className="field">
                <p className="control">
                  <button className="button is-success">
                    Register
                </button>
                </p>
              </div>
            </form>
          </div>
        </section>
      : <Spinner />
    );
  }
}

export default Register;