import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { DownloadPDF } from '../cmps/DownloadPDF.jsx'
import { utilService } from '../services/util.service.js'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const debouncedSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 500), [])

  useEffect(() => {
    fetchBugs()
  }, [filterBy])

  async function fetchBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }
  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
  let bugTitle = prompt('Bug title?') || '';
  const bug = {
    title: bugTitle,
    severity: +prompt('Bug severity?') || 0,
    description: prompt('Bug description?') || '',
  };
  try {
    const savedBug = await bugService.save(bug);
    console.log('Added Bug', savedBug);
    setBugs(prevBugs => [...prevBugs, savedBug]);
    showSuccessMsg('Bug added');
  } catch (err) {
    console.log('Error from onAddBug ->', err);
    showErrorMsg('Cannot add bug');
  }
}



  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }
  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }
  // function onChangePageIdx(pageIdx) {
  //   setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  // }

  if (!bugs) return <h1>loadings....</h1>
  // const isPaging = filterBy.pageIdx !== undefined

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        {/* <div className="bug-pagination">
            <label> Use paging
              <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
            </label>
            {isPaging && <>
              <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)}>-</button>
              <span>{filterBy.pageIdx + 1}</span>
              <button onClick={() => onChangePageIdx(filterBy.pageIdx + 1)}>+</button>
            </>}
          </div> */}
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <DownloadPDF bugs={bugs} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
