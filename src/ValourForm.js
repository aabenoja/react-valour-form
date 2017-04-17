import React from 'react';
import valour from 'valour';
import noop from 'lodash.noop';

export default class ValourForm extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    formName: React.PropTypes.string.isRequired,
    onValidatedSubmit: React.PropTypes.func
  }

  static defaultProps = {
    onValidatedSubmit: noop
  }

  constructor(props) {
    super(props);

    this.state = { formValues: {} };

    this.createOnChange = this.createOnChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { formName, onValidatedSubmit } = this.props;
    const { formValues } = this.state;

    valour.forceValidationSync(formName, formValues);
    const results = valour.getResult(formName);

    onValidatedSubmit(valour.isValid(formName), results);

    valour.runCallbacks(formName);
  }

  createOnChange(name, onChange = noop) {
    return e => {
      const { value } = e.target;
      const { formValues } = this.state;
      formValues[name] = value;
      this.setState({ formValues });
      onChange(e);
    };
  }

  render() {
    const { formName, children, ...props } = this.props;
    return (
      <form {...props} onSubmit={this.onSubmit}>
        { React.Children.map(children, child => {
          if (!child.props.valueName) return React.cloneElement(child);

          const { onChange, valueName } = child.props;
          return React.cloneElement(child, {
            formName,
            onChange: this.createOnChange(valueName, onChange)
          });
        }) }
      </form>
    );
  }
}
