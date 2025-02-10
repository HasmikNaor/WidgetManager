import Dropdown from "../shared/Dropdown";
interface IHeader {
  pages: string[];
  currentPage: string;
  onPopupOpen: () => void;
}
const Header = ({ pages, currentPage, onPopupOpen }: IHeader) => {
  return (
    <header className="header">
      <Dropdown
        selectedOption={currentPage}
        label="choose page"
        title="choose page"
        options={pages}
        className="header-dropdown"
      />
      <button className="header__btn" type="button" onClick={onPopupOpen}>
        add new widget
      </button>
    </header>
  );
};

export default Header;
