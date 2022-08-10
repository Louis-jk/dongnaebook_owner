import React from 'react'

const Layout = ({ child, props }) => {
  // console.log('Layout isLoading', isLoading)
  console.log('Layout child', child)
  console.log('Layout props', props)

  const [content, setContent] = React.useState(null)

  const checkingCompoennt = React.useCallback((child) => {
    setContent(child)
  }, [child])

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      checkingCompoennt(child)
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    content
  )
}

export default Layout
