import { Component } from "react";
import { Dropdown, Button } from "react-bootstrap";

class RandomForm extends Component {
  constructor(props) {
    super(props);
    this.state = { questions: [] };
  }

  handleSelect = (e, f) => {
    console.log("test", e);
    this.setState({ selectedCategory: e });
  };
  handleGenerate = () => {
    console.log("randomize");

    var filteredQuestions = this.state.questions.map(item => item.fields).filter(f => f.Category.includes("Love"));

    var randomQueston = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    this.setState({ generatedQuestion: randomQueston.Question });
  };

  retrieveData(offset) {
    var url = "https://api.airtable.com/v0/appWnfQqtj0SUAShf/Questions?api_key=key9Ip9PpMXah6O5p";
    if (offset) {
      url += "&offset=" + offset;
    }
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log("offset " + data.offset);

        this.setState({ questions: [...this.state.questions, ...data.records] });

        console.log("reocdes", data.records);

        if (!!data.offset) {
          setTimeout(
            aa => {
              console.log("data", aa.offset);
              this.retrieveData(aa.offset);
            },
            300,
            data
          );
        } else {
          console.log("done with iter total records is ", this.state.questions);
        }
      })
      .catch(err => {
        // Error
      });
  }

  componentDidMount() {
    console.log("test componentDidMount");
    this.retrieveData("");
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Dropdown onSelect={this.handleSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {this.state.selectedCategory || "Category"}
            </Dropdown.Toggle>
            <Dropdown.Menu id="category">
              {this.state.questions
                .map(item => item.fields.Category)
                .map(i => {
                  if (!!i) return i[0];
                })
                .filter((v, i, a) => a.indexOf(v) === i)
                .map(Category => (
                  <Dropdown.Item eventKey={Category}>{Category}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>

          {!!this.state.selectedCategory ? (
            <Button variant="primary" onClick={this.handleGenerate}>
              Randomize
            </Button>
          ) : null}

          <p>{this.state.generatedQuestion || "-"} </p>
        </form>
      </div>
    );
  }
}

export default RandomForm;
