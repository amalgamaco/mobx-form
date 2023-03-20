/* eslint-disable no-console */
const DOCS_BASE_URL = 'https://github.com/amalgamaco/mobx-form/blob/main/docs';

function docsUrl( path: string ) {
	return DOCS_BASE_URL + path;
}

function joinSentences( ...sentences: Array<string | undefined> ) {
	return sentences.filter( Boolean ).join( '. ' );
}

interface DeprecatedMethodOptions {
	alternative?: string,
	docsPath?: string
}

export default function deprecatedMethod(
	klass: string,
	method: string,
	{ alternative, docsPath }: DeprecatedMethodOptions = {}
) {
	const deprecationMessage = joinSentences(
		`DEPRECATED method '${method}' from class '${klass}'`,
		alternative && `Use '${alternative}' instead`,
		docsPath && `For more information about usage see ${docsUrl( docsPath )}`
	);

	console.warn( `mobx-form: ${deprecationMessage}` );
}
