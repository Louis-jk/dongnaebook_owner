import * as React from 'react'

import AppTest from '../AppTest'
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

test('AppTest jest test', () => {
  const tree = renderer.create(<AppTest />).toJSON()
  expect(tree).toMatchSnapshot()
})
