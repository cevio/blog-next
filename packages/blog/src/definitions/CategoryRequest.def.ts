import t from '@braken/json-schema';
export default t.Object({
  name: t.String('默认分类').required(),
  link: t.String(),
})