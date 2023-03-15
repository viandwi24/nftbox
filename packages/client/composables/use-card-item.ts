export const useCardItem = (itemSelector: string = '.list .item') => {
  const interval = ref<NodeJS.Timeout>()
  onMounted(() => {
    interval.value = setInterval(() => {
      const doms = document.querySelectorAll(itemSelector) as NodeListOf<HTMLDivElement>
      const domAnchor = doms[0]
      if (domAnchor) {
        // get width
        const width = domAnchor.clientWidth
        // set height to width
        doms.forEach((dom) => {
          dom.style.height = `${width}px`
        })
      }
    }, 10)
  })
  onBeforeUnmount(() => {
    if (interval.value) clearInterval(interval.value)
  })
}
