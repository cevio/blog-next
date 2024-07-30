import t from '@braken/json-schema';
export default t.Object({
  oldPassword: t.String('admin888'),
  newPassword: t.String('admin123'),
})