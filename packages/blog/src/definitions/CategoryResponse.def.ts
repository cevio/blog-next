import t from '@braken/json-schema';
export default t.Object({
  id: t.Number(),
  cate_name: t.String(),
  cate_order: t.Number(),
  cate_outable: t.Boolean(),
  cate_outlink: t.String(),
  gmt_create: t.String(),
  gmt_modified: t.String(),
})