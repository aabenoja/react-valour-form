import React from 'react';
import valour from 'valour';
import { mount } from 'enzyme';
import test from 'ava';

import ValourForm from '../src/ValourForm';
import wrapWithValour from 'wrap-component-with-valour';

const WrappedInput = wrapWithValour('input');
const rules = {
  Email: valour.rule.isEmail().isRequired()
};

function createForm() {
  return mount(
    <ValourForm formName="testForm">
      <h2>Form header</h2>
      <WrappedInput
        valueName="Email"
        rules={rules}
      />
    </ValourForm>
  );
}

test('applies the form name to all valour-wrapped children', t => {
  const form = createForm();
  t.is(form.find('ValidatedComponent').prop('formName'), 'testForm');
});
