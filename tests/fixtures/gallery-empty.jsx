import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { ProductGallery } from '@/components/ProductGallery';
import { InstallationPhotoStrip } from '@/components/InstallationPhotoStrip';

const empty = renderToStaticMarkup(<ProductGallery images={[]} />);
assert.match(empty, /Image unavailable/);
assert.doesNotMatch(empty, /<button|<img|<dialog/);
assert.equal(renderToStaticMarkup(<InstallationPhotoStrip photos={[]} />), '');
console.log(JSON.stringify({ passed: true, emptyProduct: true, emptyInstallation: true, mode: 'SSR' }));
