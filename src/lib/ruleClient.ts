export function evaluateRule(
	code:string,
	state:any[]
):Promise<boolean>{

	return new Promise((resolve)=>{

		const worker = new Worker(
			new URL(
				"./ruleWorker.ts",
				import.meta.url
			),
			{
				type:"module"
			}
		);


		worker.onmessage = (event)=>{

			resolve(
				event.data.result
			);

			worker.terminate();

		};


		worker.postMessage({
			code,
			state
		});

	});

}