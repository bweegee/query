import React, { Fragment } from "react";
import { Form } from "semantic-ui-react";
import axios from "axios";

class EditQuestion extends React.Component {
  state = { name: "", 
  explanation: "", 
  choices: [], 
  flashMsgText: "", 
  showFlash: false  };

  renderFlash = () => {
    return ( <div style={flashStyle}>
      {this.state.flashMsgText}
    </div>)
  }

  componentDidMount() {
    const { name, explanation, choices } = this.props;
    this.setState({ name, explanation, choices });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleChoiceChange = e => {
    const choice = this.state.choices[e.target.name];
    choice.answer = e.target.value;
    if (choice.answer !== ""){
    const choices = this.state.choices.map(c => {
      if (c.id === choice.id) return choice;
      else return c;
    });
    this.setState({ choices: choices, showFlash: false });
  } else {
    this.setState({ flashMsgText: "Choice cannot be empty", showFlash: true})
  }
  };

  handleCorrectAnswer = (e, { name, value }) => {
    const { qType } = this.props;
    const choice = this.state.choices[name];
    choice.correct_answer = value;
    var choices = this.state.choices.map(c => {
      if (c.id === choice.id) return choice;
      else return c;
    });
    if (qType === "TorF") {
      if (
        choices[0].correct_answer === true &&
        choices[1].correct_answer === true
      ) {
        if (name === 0) {
          const theOtherChoice = this.state.choices[1];
          theOtherChoice.correct_answer = false;
          choices = this.state.choices.map(c => {
            if (c.id === theOtherChoice.id) return theOtherChoice;
            else return c;
          });
        } else {
          const theOtherChoice = choices[0];
          theOtherChoice.correct_answer = false;
          choices = this.state.choices.map(c => {
            if (c.id === theOtherChoice.id) return theOtherChoice;
            else return c;
          });
        }
      }
    }
    this.setState({ choices: choices });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.showFlash){
    const question = {
      name: this.state.name,
      explanation: this.state.explanation
    };
    const { quiz_id, question_id, qType } = this.props;
    const { choices } = this.state;
    axios.put(`/api/quizzes/${quiz_id}/questions/${question_id}`, question);
    if (qType !== "open")
      choices.map(choice =>
        axios.put(`/api/questions/${question_id}/choices/${choice.id}`, choice)
      );
    this.setState({ name: "", explanation: "", choices: [] });
    this.props.toggleForm(1);
    }
    document.location.reload(true);
  };

  render() {
    const { name, explanation, choices } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          label="Edit Question Text"
          value={name}
          name="name"
          onChange={this.handleChange}
          required
        />
        <Form.Input
          label="Edit Explanation"
          value={explanation}
          name="explanation"
          onChange={this.handleChange}
        />
          { this.state.showFlash && this.renderFlash()}
        {choices.map((choice, index) => (
          <Fragment key={choice.id}>
            <Form.Input
              label="Edit Choice"
              value={this.state.choices[index].answer}
              name={index}
              onChange={this.handleChoiceChange}
            />
            <Form.Checkbox
              label="Correct Answer? "
              value={!choice.correct_answer}
              checked={choice.correct_answer ? true : false}
              onClick={this.handleCorrectAnswer}
              name={index}
            />
          </Fragment>
        ))}
        <Form.Button>Update</Form.Button>
      </Form>
    );
  }
}
export default EditQuestion;

const flashStyle = {
  backgroundColor: "#FEEFB3",
  color: "#9F6000",
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: "5px",
  marginBottom: "10px"
}
