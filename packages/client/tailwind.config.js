const MyTheme = {
  colors: {
    green: {
      DEFAULT: '#3BA676',
      50: '#B4E4CF',
      100: '#A5DFC5',
      200: '#87D4B2',
      300: '#69CA9E',
      400: '#4BBF8B',
      500: '#3BA676',
      600: '#2C7D59',
      700: '#1E533B',
      800: '#0F2A1E',
      900: '#000000'
    },
    purple: {
      DEFAULT: '#822FD6',
      50: '#DEC8F4',
      100: '#D4B7F1',
      200: '#BF95EA',
      300: '#AB73E3',
      400: '#9651DD',
      500: '#822FD6',
      600: '#6622AB',
      700: '#4A197C',
      800: '#2E0F4D',
      900: '#12061F'
    },
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
    // another plugins
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        primary: MyTheme.colors.purple,
        green: MyTheme.colors.green,
        purple: MyTheme.colors.purple,
      }
    }
  }
}
