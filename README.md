# Website

[Docs](https://smanim-docs.vercel.app) for [smanim](https://github.com/tommy11jo/still-manim), a python library for creating diagrams that is based on manim. You can try it on the [web editor](https://idraw.chat).

These docs also serve the `.mdx` files for each page at `api/mdx/{slug}`. These files are important for providing context for the LLM that edits diagrams on the web editor. I could have just copied and pasted all the files but this is cooler (even if slightly slower). It's also a look into what LLM-first documentation should look like (see more on that topic [here](https://smanim-docs.vercel.app/docs/extras/Documentation)).

Built with [Docusaurus](https://docusaurus.io/) and deployed on Vercel.

# Development

To run locally:

```shell
npm run start
```

To build the docusaurus site and copy all files with a `.mdx` suffix into the `build/mdx/` folder:

```shell
npm run build
```

To test the vercel serverless function for serving mdx files:

```shell
vercel dev
```
