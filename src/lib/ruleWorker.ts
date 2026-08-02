function runRule(
	code: string,
	state: any[]
) {

	const fn = new Function(
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

		function rank(card) {
			return card.rank;
		}

		${code}

		return rules(state);
		`
	);


	return fn(state);

}


self.onmessage = (event) => {

	const {
		code,
		state
	} = event.data;


	try {

		const result =
			runRule(
				code,
				state
			);


		self.postMessage({
			ok: true,
			result
		});


	}
	catch (e) {

		self.postMessage({
			ok: false,
			result:false,
			error:String(e)
		});

	}

};