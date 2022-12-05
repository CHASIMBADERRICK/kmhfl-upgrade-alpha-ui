import React, { useState, useEffect, useRef} from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { PlusIcon } from '@heroicons/react/solid';
import {Formik, Form, Field} from 'formik'

import { useAlert } from 'react-alert'

function EditListWithCount({ initialSelectedItems, itemsCategory, itemsCategoryName, setUpdatedItem, item, removeItemHandler}) {
  
  
  const alert = useAlert()

  const itemOptions = ((options) => {
    return options.map(({ name, subCategories, value }) => ({
      label: name,
      options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
    }))
  })(itemsCategory)


  const [currentItem, setCurrentItem] = useState(null)
  const [itemCount, setItemCount] = useState(null)
  const [countFieldIds, setCountFieldIds] = useState([])
  const [isRemoveItem, setIsRemoveItem] = useState(false)
  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
  const result = []

    initialSelectedItems.map(({ subCategories, value, _id }) => {
      result.push({ name: subCategories[0], id: value[0], _id})

    })



    return result

  })() : []))


  useEffect(() => {
    if(itemCount && currentItem){
        setCurrentItem(() => {currentItem['count'] = itemCount; return currentItem})
        setCountFieldIds([currentItem, ...countFieldIds])
        
    }
    setUpdatedItem(selectedItems)
  }, [selectedItems, isRemoveItem, itemCount])


  const countRef = useRef(null)

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

    return (
        <Formik
            initialValues={(() => {
                const _initValues = {}
                initialSelectedItems.forEach(({_id, count}) => {
                    _initValues[_id] = count
                })

                if(countFieldIds.length > 0){
                    countFieldIds.forEach(({id, count}) => {
                        _initValues[id] = count
                    })
                }

                return _initValues
            })()}

            onSubmit={() => null}
        >
            <Form
                name="list_item_with_count_form"
                className="flex flex-col w-full items-start justify-start gap-3"

            >
                {/* Item List Dropdown */}
                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                    <label
                        htmlFor='available_items'
                        className='capitalize text-md  leading-tight tracking-tight'>
                        Available {itemsCategoryName}
                    </label>

                    <div className="flex items-start gap-2 md:w-5/6 w-full h-auto">

                        <Select
                            options={itemOptions}
                            formatGroupLabel={formatGroupLabel}
                            onChange={(e) => {
                                if(countRef.current){
                                    setCurrentItem({ id: e?.value, name: e?.label, count: countRef.current.value})
                                } else {
                                    setCurrentItem({ id: e?.value, name: e?.label, count: 1 })
                                }
                               
                            }
                            }
                            name="available_items"
                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                        />
                        <button className="bg-green-700 rounded p-2 flex items-center justify-evenly gap-2"
                            onClick={e => {
                                e.preventDefault()

                                if(countRef.current){
                                    setItemCount(countRef.current.value)
                                }

                                if (currentItem)
                                    setSelectedItems([
                                        currentItem,
                                        ...selectedItems,
                                    ])
                                
                            }}>
                            <p className='text-white font-semibold'>Add</p>
                            <PlusIcon className='w-4 h-4 text-white' />
                        </button>
                    </div>
                </div>

                {/* Item Count */}
                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                    <label
                        htmlFor='item_count'
                        className='capitalize text-md  leading-tight tracking-tight'>
                        {itemsCategoryName} Count
                    </label>

                    <input type="number"
                        ref={countRef}
                        name='item_count' 
                        className='flex-none md:w-5/6 w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none' />

                </div>
                <br />

                {/* Item Selected Table */}
                <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                    Assigned {itemsCategoryName}
                </span>{" "}
                <Table className="md:px-4">
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <p className='capitalize text-base font-semibold'>{itemsCategoryName}</p>
                            </TableCell>
                            <TableCell>
                                <p className='text-base font-semibold'>Number</p>
                            </TableCell>
                            <TableCell className='text-xl font-semibold'>
                                <p className='text-base font-semibold'>Action</p>
                            </TableCell>
                        </TableRow>

                        <>
                            {selectedItems && selectedItems?.length > 0 ? (
                                selectedItems?.map(({ name, _id, id}, __id) => (
                                    <TableRow
                                        key={_id ?? id}

                                    >
                                        <TableCell>{name}</TableCell>
                                        <TableCell>
                                            { 
                                            _id ?
                                            <Field
                                             type='number'
                                             name={_id}
                                             className="flex-none w-24 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            />
                                            :
                                            <Field
                                             type='number'
                                             value={countRef.current.value}
                                             name={id}
                                             onChange={e => {
                                                e.preventDefault()
                                             }}
                                             className="flex-none w-24 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            />

                                            }
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    let items = selectedItems
                                                    items.splice(__id, 1)
                                                    setIsRemoveItem(!isRemoveItem)
                                                    setSelectedItems(
                                                        items
                                                    );

                                                    // Delete facility service
                                                    removeItemHandler(e, _id ?? id, alert)

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


            </Form>
        </Formik>
     )
}

export default EditListWithCount