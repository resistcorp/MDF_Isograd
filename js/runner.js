const readline_object = null;

const file = Deno.args[0];

console.log("importing ", file);

import("../" + file).then(result => {
	console.log("imported file :", result);
}).catch(e => console.error(e));