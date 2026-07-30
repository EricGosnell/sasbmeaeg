self.onmessage = (event) => {
	const {
		code,
		state
	} = event.data;

	try {
		const compiledRule = new Function(
			"state",
			`
			function first(state) {
				return state[0];
			}

			function last(state) {
				return state[state.length - 1];
			}

			function suit(card) {
				return card.suit;
			}

			${code}

			return rules(state);
			`
		);

		const result = compiledRule(state);

		self.postMessage({
			ok: true,
			result
		});

	} catch (e) {
		console.error(e);

		self.postMessage({
			ok: false,
			error: String(e)
		});
	}
};