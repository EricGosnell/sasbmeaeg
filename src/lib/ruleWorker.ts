self.onmessage = (event) => {

	const {
		code,
		state
	} = event.data;


	try {

		const result =
			new Function(
				"state",
				`
				function last(state) {
					return state[state.length - 1];
				}

				function suit(card) {
					return card.suit;
				}

				${code}

				return rules(state);
				`
			)(state);


		self.postMessage({
			ok:true,
			result
		});

	}

	catch(e){

		self.postMessage({
			ok:false,
			error:String(e)
		});

	}

};