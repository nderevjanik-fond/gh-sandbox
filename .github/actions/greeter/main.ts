export function greet(name: string) {
  if (name.trim() == "") {
    return "Who are you?";
  }

  return `Hello ${name}!`;
}

if (import.meta.main) {
  const firstArg = Deno.args[0];
  console.log(greet(firstArg));
}
