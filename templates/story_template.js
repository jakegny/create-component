import React from 'react'
import { storiesOf } from '@kadira/storybook'
import {{componentName}} from './component'

const displayName = {{componentName}}.displayName || '{{componentName}}'

const demo = () => (
  <{{componentName}} />
)

const title = 'some example'

storiesOf(displayName, module)
  .add(title, demo)
