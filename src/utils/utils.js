import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const supportImg = [
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/gif',
  'image/webp',
]

export const getImage = (src) => {
  const img = new Image()
  // cors
  if (!src.startsWith('data')) {
    img.crossOrigin = 'Anonymous'
  }
  return new Promise(function (resolve, reject) {
    img.onload = function () {
      resolve(img)
    }
    const errorHandler = function () {
      return reject(new Error('An error occurred attempting to load image'))
    }
    img.onerror = errorHandler
    img.onabort = errorHandler
    img.src = src
  })
}

export const getMargin = (width, height, r = 0.15) => {
  const min = Math.min(width, height)
  return Math.round(min * r)
}

export const svgToDataURL = (svgStr) => {
  const encoded = encodeURIComponent(svgStr).replace(/'/g, '%27').replace(/"/g, '%22');

  const header = 'data:image/svg+xml,';
  const dataUrl = header + encoded;

  return dataUrl;
}