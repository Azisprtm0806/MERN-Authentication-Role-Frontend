import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import ChangeRole from '../../components/ChangeRole/ChangeRole'
import { Spinner } from '../../components/Loader/Loader'
import PageMenu from '../../components/PageMenu/PageMenu'
import Search from '../../components/Search/Search'
import UserStats from '../../components/UserStats/UserStats'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { deleteUser, getUsers } from '../../redux/features/auth/authSlice'
import { shortenText } from '../Profile/Profile';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import "./UsersList.scss"
import { FILTER_USERS, selectUser } from '../../redux/features/auth/filterSlice'
import ReactPaginate from 'react-paginate';

const UsersList = () => {
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();

  const [search, setSeacrh] = useState("")

  const {users, isLoading} = useSelector((state) => state.auth);
  const filteredUsers = useSelector(selectUser)
  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch]);

  const removeUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(getUsers());
  }

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Delete this user.',
      message: 'Are you sure to do delete this user?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => removeUser(id)
        },
        {
          label: 'Cancel',
          onClick: () => alert('Click No')

        }
      ]
    });
  }

  // search
  useEffect(() => {
    dispatch(FILTER_USERS({users, search}))
  }, [dispatch, users, search]);


  // Begin Pagination
  const itemsPerPage = 5;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
    setItemOffset(newOffset);
  };
  // End pagination

  return (
    <section>
      <div className="container">
        <PageMenu />
        <UserStats />

        <div className="user-list">
        {isLoading &&  <Spinner />}
          <div className="table"> 
            <div className="--flex-between">
              <span>
                <h3>All Users</h3>
              </span>
              <span>
                <Search value={search} onChange={(e) => setSeacrh(e.target.value)} />
              </span>
            </div>
            {/* Table */}
            {!isLoading && users.length === 0 ? (
              <p>No User Found...</p>
            ) : (
              <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => {
                  const {_id, name, email, role} = user
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 8)}</td>
                      <td>{email}</td>
                      <td>{role}</td>
                      <td>
                        <ChangeRole _id={_id} email={email} />
                      </td>
                      <td>
                        <span>
                          <FaTrashAlt size={20} color="red" onClick={() => confirmDelete(_id)} />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            )}
            <hr />
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="Prev"
            renderOnZeroPageCount={null}

            containerClassName="pagination"
            pageLinkClassName='page-num'
            previousLinkClassName='page-num'
            nextLinkClassName='page-num'
            activeLinkClassName='activePage'
          />
        </div>
      </div>
    </section>
  )
}

export default UsersList