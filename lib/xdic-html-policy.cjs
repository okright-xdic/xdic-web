'use strict';

const sanitizeHtml = require('sanitize-html');

const colorPattern =
  /^(?:#[0-9a-f]{3,8}|[a-z]{1,20}|rgba?\([0-9.,%\s]+\))$/i;

const sizePattern =
  /^(?:0|[0-9]{1,4}(?:\.[0-9]{1,3})?(?:px|em|rem|pt|%)|auto)$/i;

const spacingPattern =
  /^(?:0|[0-9]{1,4}(?:\.[0-9]{1,3})?(?:px|em|rem|pt|%))(?:\s+(?:0|[0-9]{1,4}(?:\.[0-9]{1,3})?(?:px|em|rem|pt|%))){0,3}$/i;

const borderPattern =
  /^[0-9]{1,2}px\s+(?:solid|dashed|dotted)\s+#[0-9a-f]{3,8}$/i;

const rasterDataImage =
  /^data:image\/(?:png|jpeg|jpg|gif|webp|bmp);base64,[a-z0-9+/]+={0,2}$/i;

const safeImageSource = (src) => {
  if (typeof src !== 'string') return false;

  return rasterDataImage.test(src) ||
    /^https?:\/\/[^/\s\\]+(?:[/?#][^\s\\]*)?$/i.test(src) ||
    /^\/(?![\/\\])[^\s\\]*$/.test(src);
};

function sanitizeContent(input) {

  const source = String(input ?? '');

  return sanitizeHtml(source, {

    allowedTags: [
      'p', 'div', 'span', 'br', 'hr',
      'b', 'strong', 'i', 'em', 'u',
      's', 'del', 'strike', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot',
      'tr', 'th', 'td', 'caption',
      'a', 'img', 'figure', 'figcaption'
    ],

    allowedAttributes: {
      '*': ['style', 'title', 'lang', 'dir'],
      a: ['href', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
      ol: ['start']
    },

    allowedSchemes: [
      'http', 'https', 'mailto', 'tel'
    ],

    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },

    allowedSchemesAppliedToAttributes: [
      'href', 'src'
    ],

    allowProtocolRelative: false,

    allowedStyles: {

      '*': {
        color: [colorPattern],
        'background-color': [colorPattern],
        'font-size': [sizePattern],
        'font-weight': [
          /^(?:normal|bold|[1-9]00)$/i
        ],
        'font-style': [
          /^(?:normal|italic|oblique)$/i
        ],
        'text-decoration': [
          /^(?:none|underline|line-through)$/i
        ],
        'text-align': [
          /^(?:left|right|center|justify)$/i
        ],
        'line-height': [
          /^(?:normal|[0-9](?:\.[0-9]+)?|[0-9]{1,3}px|[0-9]{1,3}%)$/i
        ],
        'vertical-align': [
          /^(?:top|middle|bottom|baseline)$/i
        ],
        width: [sizePattern],
        'max-width': [sizePattern],
        height: [sizePattern],
        margin: [spacingPattern],
        padding: [spacingPattern],
        border: [borderPattern],
        'border-radius': [sizePattern],
        'border-collapse': [
          /^(?:collapse|separate)$/i
        ]
      }
    },

    transformTags: {

      img: (tagName, attribs) => {

        const safeAttributes = { ...attribs };

        if (!safeImageSource(safeAttributes.src)) {
          delete safeAttributes.src;
        }

        return {
          tagName: 'img',
          attribs: safeAttributes
        };
      }
    },

    exclusiveFilter: (frame) =>
      frame.tag === 'img' && !frame.attribs.src,

    disallowedTagsMode: 'discard',

    textFilter: (text) =>
      text.replace(/\r\n|\r|\n/g, '<br />')
  });
}

module.exports = { sanitizeContent };