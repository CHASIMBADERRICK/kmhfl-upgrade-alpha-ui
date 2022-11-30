import React, {useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'




function EditListItem({initialSelectedItems, itemsCategory, setUpdatedItem, item}) {
    


    const itemOptions = ((options) => {
        return options.map(({name, subCategories, value}) => ({
            label: name,
            options: subCategories.map((_label, i) => ({label: _label, value: value[i]}))
        }))
    })(itemsCategory)


    const formatGroupLabel = (data) => (
        <div style={
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }
        }>
          <span>{data.label}</span>
          <span style={
            {
                backgroundColor: '#EBECF0',
                borderRadius: '2em',
                color: '#172B4D',
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: '1',
                minWidth: 1,
                padding: '0.16666666666667em 0.5em',
                textAlign: 'center',
              }
          }>{data.options.length}</span>
        </div>
      );

   
    const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
    const result = []

    initialSelectedItems.map(({subCategories, value}, i) => {

    result.push({name: subCategories[0], id: value[0] })

    })

    

  return result

  })() : []))


  useEffect(() => {
        setUpdatedItem(selectedItems)
  }, [selectedItems])
 

  return (
    <form
                    name="list_item_form"
                    className="flex flex-col w-full items-center justify-start gap-3"
                    onSubmit={ev => ev.preventDefault()}
                  >
                    {/* Transfer list Container */}
                    <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      Available Services
                    </span>
                    <div className="flex items-center w-full h-auto">
                      <Select
                        options={itemOptions}
                        // isMulti
                        // closeMenuOnSelect={false}
                        formatGroupLabel={formatGroupLabel}
                        onChange={(e) => {
                            // console.log({e})
                                // let latest_service = e[e.length - 1]

                                // if(latest_service){
                                setSelectedItems([
                                    {id: e?.value, name: e?.label}, 
                                    ...selectedItems,
                                ])


                            // }
                        }
                        }
                        name="item_drop_down"
                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                      />
                    </div>
                    <br />


                    <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      Assigned Services
                    </span>{" "}
                    <Table className="md:px-4">
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <p className='text-base font-semibold'>Service</p>
                                </TableCell>
                                <TableCell className='text-xl font-semibold'>
                                    <p className='text-base font-semibold'>Action</p>
                                </TableCell>
                            </TableRow>
                        
                      <>
                        {selectedItems && selectedItems?.length > 0 ? (
                          selectedItems?.map(({ id, name }) => (
                            <TableRow
                              key={id}
                              
                            >
                              <TableCell>{name}</TableCell>
                              <TableCell>
                                <button
                                  type="button"
                                  onClick={() => {
                                    selectedItems.splice(id, 1)
                                    setSelectedItems(
                                        selectedItems.filter(
                                        (item) => item.id !== id
                                      )
                                    );
                                  }}
                                  className="flex items-center justify-center space-x-2 bg-red-400 rounded p-1 px-2"
                                >
                                  <span className="text-medium font-semibold text-white">
                                    Remove
                                  </span>
                                </button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <>
                            <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                              <p>
                                {item?.name || item?.official_name} has not listed
                                the {'item'} it offers. Add some below.
                              </p>
                            </li>
                            <br />
                          </>
                        )}
                      </>
                      </TableBody>
                    </Table>
                   
                  </form>
  )
}

export default EditListItem