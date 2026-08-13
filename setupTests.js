import '@testing-library/jest-dom';
const { TextDecoder, TextEncoder } = require('util');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

jest.mock('@heroui/react', () => {
  const React = require('react');

  const passthrough = (Tag) =>
    ({ children, ...props }) =>
      React.createElement(Tag, props, children);

  const SearchField = ({ children, ...props }) =>
    React.createElement('div', props, children);

  SearchField.Group = passthrough('div');
  SearchField.SearchIcon = passthrough('span');
  SearchField.Input = (props) => React.createElement('input', props);
  SearchField.ClearButton = passthrough('button');

  const Avatar = ({ children, ...props }) =>
    React.createElement('div', props, children);

  Avatar.Fallback = passthrough('div');

  return {
    __esModule: true,
    Card: passthrough('div'),
    CardHeader: passthrough('div'),
    Label: passthrough('label'),
    SearchField,
    Avatar,
    Button: passthrough('button'),
    Chip: passthrough('span'),
    ScrollShadow: passthrough('div'),
  };
}, { virtual: true });
