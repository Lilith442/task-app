import Filters from "./Filters";
import ViewSwitch from "./ViewSwitch";
import "./ToolbarSection.css";
import "./Search.css";
import "./ViewSwitch";
import "./Filters.css";

function ToolbarSection({

    search,
    setSearch,

    filter,
    setFilter,

    view,
    setView,

    texts,
    language,

}) {

    return (

        <div className="toolbar-card">
        <div className="search-box">
        
            <input
                type="text"
                placeholder={texts.toolbar.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        
        </div>

        <Filters
            
            filter={filter}
            setFilter={setFilter}
            texts={texts}
            
        />

            <ViewSwitch
            
                view={view}
                setView={setView}
                texts={texts}
            
            />
        </div>

    );

}

export default ToolbarSection;