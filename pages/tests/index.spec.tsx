import * as React from 'react'
import {mount} from 'enzyme'
import IndexPage from '../index';

// Props
const props = {
  name: 'Hello Next.js'
};

  // Context
const compGlobal = mount(
    <IndexPage {...props} />
);

describe('<Console />', () => {
  it('component should render child', () => {
    expect(compGlobal.find('div').text()).toBe('Hello World!')
  });
});