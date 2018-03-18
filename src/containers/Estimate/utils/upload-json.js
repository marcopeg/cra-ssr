/*

*//*
    global document FileReader
*/
const uploadJson = () => new Promise((resolve) => {
    const uploadBtn = document.createElement('input')
    const removeTimer = setTimeout(() => uploadBtn.remove(), 1000 * 60)

    const clearOut = () => {
        clearTimeout(removeTimer)
        uploadBtn.remove()
    }

    const handleFileUpload = (evt) => {
        const reader = new FileReader()
        reader.onload = (loadEvt) => {
            const doc = JSON.parse(loadEvt.target.result)
            clearOut()
            resolve(doc)
        }
        reader.readAsText(evt.target.files[0])
    }

    uploadBtn.type = 'file'
    uploadBtn.accept = 'text/json'
    uploadBtn.addEventListener('change', handleFileUpload, false)
    uploadBtn.click()
})

export default uploadJson
