react-valour-form
=================

A simple form component to wrap around your valour-enhanced inputs.

## Props

* `formName` * required

  The name of the valour form all the wrapped inputs will be validated against
  
  
* `onValidatedSubmit` - **Defaults to NOOP**

  The callback made after the submit event is fired and validation against all fields has been made. Two parameters are passed to this callback, `formIsValid` and `validationResults`. The first is what you get back from `valour.isValid(yourFormName)`, and the second is what is returned from `valour.getResult(yourFormName)`.


## Usage

```jsx
import React from 'react';
import valour from 'valour';
import wrapWithValour from 'wrap-component-with-valour';
import ValourForm from 'react-valour-form';

const rules = {
  Email: valour.rule.isEmail()
};

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
  }
  
  onChange(e) {
    const { value } = e.target;
    this.setState({ email: value });
  }
  
  onStateChanged(valueName, value, isValid, validationMessage) {
    this.setState({ errorMessage: validationMessage });
  }
  
  onSubmit(isValid, validationResults) {
    if (isValid) {
      // handle things as normal
      return;
    }
    
    // potentially do stuff with validationResults on error
  }

  render() {
    return (
      <ValourForm onValidatedSubmit={this.onSubmit} formName="myTestForm">
        <h3>{ this.state.errorMessage }</h3>
        <WrappedInput
          valueName="Email"
          rules={rules}
          onValidationStateChanged={this.onStateChanged}
          onChange={this.onChange}
        />
      </ValourForm>
    );
  }
}
```
