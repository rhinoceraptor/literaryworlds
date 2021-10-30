
export const waitUntil = (
  checkTermination: () => boolean,
  timeoutMs = 2000,
  intervalMs = 50
): Promise<void> => {
  const getTime = () => new Date().getTime()
  const startTime = getTime()

  const timedOut = (): boolean =>
    (getTime() - startTime) >= timeoutMs

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (checkTermination()) {
        clearInterval(interval)
        resolve()
      } else if (timedOut()) {
        clearInterval(interval)
        reject()
      }
    }, intervalMs)
  })
}
