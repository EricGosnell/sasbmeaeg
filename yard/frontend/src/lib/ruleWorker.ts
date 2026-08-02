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
		
		function last_n(n, predicate) {
          const cards = state.slice(-n);
          if (predicate) {
             return cards.filter(predicate);
          }
          return cards;
       	}
       
       	function last_n_matching(n, predicate) {
			return state.filter(predicate).slice(-n);
		}

       	function sum(cards) {
          	return cards.reduce((total, card) => total + rank(card), 0);
       	}

		function suit(card) {
			return card.suit;
		}

		function rank(card) {
			const rankMap = {
			   A: 1,
			   "2": 2,
			   "3": 3,
			   "4": 4,
			   "5": 5,
			   "6": 6,
			   "7": 7,
			   "8": 8,
			   "9": 9,
			   "10": 10,
			   J: 11,
			   Q: 12,
			   K: 13,
			   Joker1: 0,
			   Joker2: 0
			};
			return rankMap[card.rank];
		}
		
		function color(card) {
			return card.color;
		}
		
		function isFace(card) {
			return card.isFace;
		}
		
		function isRotationallySymmetric(card) {
			return card.isRotationallySymmetric;
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