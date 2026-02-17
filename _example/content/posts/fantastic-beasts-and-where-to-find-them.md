---
title: Fantastic Beasts and Where to Find Them
date: 2019-11-01
description: A collection of code examples and demonstrations
tags:
  - Novel
  - 编程
  - 硬件
  - 旅游
  - 摄影
published: true
---

## React Component Example

Here's an example of how you might embed a Spotify player:

```jsx
<SpotifyPlayer
  uri="spotify:user:bbcamerica:playlist:3w18u69NplCpXVG4fQG726"
  size="large"
  theme="black"
  view="list"
/>
```

## Live Code Example

```js
const onClick = () => {
  alert("You opened me");
};

// Usage: <button onClick={onClick}>Alohomora!</button>
```

## Normal Code Block

```js
(function() {
  var cache = {};
  var form = $('form');
  var minified = true;

  var dependencies = {};

  var treeURL = 'https://api.github.com/repos/PrismJS/prism/git/trees/gh-pages?recursive=1';
  var treePromise = new Promise(function(resolve) {
    $u.xhr({
      url: treeURL,
      callback: function(xhr) {
        if (xhr.status < 400) {
          resolve(JSON.parse(xhr.responseText).tree);
        }
      }
    });
  });
})();
```

## JSDoc Comment Example

```js
/**
 * Get value out of string (e.g. rem => px)
 * If value is px strip the px part
 * If the input is already a number only return that value
 * @param {string | number} input
 * @param {number} [rootFontSize]
 * @return {number} Number without last three characters
 * @example removeLastThree('6rem') => 6
 */
const getValue = (input, rootFontSize = 16) => {
  if (typeof input === `number`) {
    return input / rootFontSize;
  }

  const isPxValue = input.slice(-2) === `px`;

  if (isPxValue) {
    return parseFloat(input.slice(0, -2));
  }

  return parseFloat(input.slice(0, -3));
};

// This is a little helper function
const helper = (a, b) => a + b;

// This is also a little helper function but with a really long one-line comment
const morehelper = (a, b) => a * b;

export { getValue, helper, morehelper };
```

## Layout Component

```jsx
import Test from "../components/test"

const Layout = ({ children }) => (
  <Test>
    {children}
  </Test>
)

export default Layout
```

## Code Highlighting Example

```jsx
import * as React from "react";

const Post = ({ data: { post } }) => (
  <Layout>
    <Heading variant="h2" as="h2">
      {post.title}
    </Heading>
    <p
      sx={{
        color: `secondary`,
        mt: 3,
        a: { color: `secondary` },
        fontSize: [1, 1, 2],
      }}
    >
      <span>{post.date}</span>
      {post.tags && (
        <React.Fragment>
          {` — `}
          <ItemTags tags={post.tags} />
        </React.Fragment>
      )}
    </p>
    <section
      sx={{
        my: 5,
        ".gatsby-resp-image-wrapper": { my: 5, boxShadow: `lg` },
      }}
    >
      <MDXRenderer>{post.body}</MDXRenderer>
    </section>
  </Layout>
);

export default Post;
```

Here will `inline code` go, just inside the text. Wow!
