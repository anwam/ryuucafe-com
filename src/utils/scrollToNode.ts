// scrollToNode is a function to smoothly scroll to a node in the DOM
export const scrollToNode = (id: string) => {
	if (typeof document === "undefined") return;
	if (!id || !id.startsWith("#")) return;

	const targetId = id.slice(1);
	const node = document.getElementById(targetId);
	if (!node) return;

	const headerOffset = 108;
	const offset =
		node.getBoundingClientRect().top + window.scrollY - headerOffset;
	window.scrollTo({
		top: offset,
		behavior: "smooth",
	});
};
