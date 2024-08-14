import slugify from 'slugify';
export default function generateSlug(
  params: string,
  id?: number | string,
): string {
  let replaceString = slugify(params, { strict: true });
  if (id) {
    replaceString = `${id}-${replaceString}`;
  }
  return replaceString;
}
