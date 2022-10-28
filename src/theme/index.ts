import { extendTheme } from '@chakra-ui/react'
const overrides = {
  fonts: {
      body: "system-ui, sans-serif",
      heading: "Georgia, serif",
      mono: "Menlo, monospace",
    },

    colors: {
      brand: {
        100: "#f7fafc",
        900: "#1a202c",
      }
    },
  components: {

    // Other components go here
  },
}

const theme= extendTheme(overrides)

export default theme