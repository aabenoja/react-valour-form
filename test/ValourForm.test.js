import React from 'react';
import valour from 'valour';
import { mount } from 'enzyme';
import test from 'ava';
import noop from 'lodash.noop';
import isEmpty from 'lodash.isempty';

import ValourForm from '../src/ValourForm';
import wrapWithValour from 'wrap-component-with-valour';

const WrappedInput = wrapWithValour('input');
const rules = {
  Email: valour.rule.isEmail()
};

function createForm({onStateChanged = noop, onSubmit = noop, onChange = noop} = {}) {
  return mount(
    <ValourForm formName="testForm" onValidatedSubmit={onSubmit}>
      <h2>Form header</h2>
      <WrappedInput
        valueName="Email"
        rules={rules}
        onValidationStateChanged={onStateChanged}
        onChange={onChange}
      />
    </ValourForm>
  );
}

test('ValourForm applies the form name to all valour-wrapped children', t => {
  const form = createForm();
  t.is(form.find('ValidatedComponent').prop('formName'), 'testForm');
});

test('ValourForm tracks the values of fields on change', t => {
  const value = 'bad@email';
  const form = createForm();
  form.find('input').simulate('change', { target: { value } });
  const { Email } = form.state('formValues');
  t.is(Email, value);
});

test('ValourForm forces validation of valour-wrapped fields on submission', t => {
  let validationStateChangedWasCalled = false;
  const form = createForm({ onStateChanged: () => validationStateChangedWasCalled = true });
  form.find('form').simulate('submit');
  t.true(validationStateChangedWasCalled);
});

test('ValourForm calls user\'s submit handler with validation results', t => {
  let formIsValid = true;
  let validationResults = {};

  const form = createForm({ onSubmit: (isValid, results) => {
    formIsValid = isValid;
    validationResults = results;
  }});

  form.find('form').simulate('submit');

  t.false(formIsValid);
  t.false(isEmpty(validationResults));
});

test('ValourForm does not overwrite a user defined onChange event', t => {
  let changeCalled = false;
  const form = createForm({ onChange: () => changeCalled = true});
  form.find('input').simulate('change');
  t.true(changeCalled);
});
