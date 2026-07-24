import Filters from "./Filters";
import ViewSwitch from "./ViewSwitch";
import "./ToolbarSection.css";

function ToolbarSection({

    search,
    setSearch,

    filter,
    setFilter,

    view,
    setView,

}) {

    return (

        <div className="toolbar-section">
        <div className="search-box">
        
            <input
                type="text"
                placeholder="Görev Ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        
        </div>

        <Filters
            
            filter={filter}
            setFilter={setFilter}
            
        />

            <ViewSwitch
            
                view={view}
                setView={setView}
            
            />
        </div>

    );

}

export default ToolbarSection;